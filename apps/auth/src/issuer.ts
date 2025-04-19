import { issuer } from "@openauthjs/openauth"
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare"
import {
  type ExecutionContext,
  type KVNamespace,
} from "@cloudflare/workers-types"
import { subjects } from "@badbird5907/auth-commons"
import { coreUsers, createDb } from "@/src/db"
import { GoogleProvider } from "@openauthjs/openauth/provider/google"
import { Theme } from "@openauthjs/openauth/ui/theme"
import { WorkerMailer } from 'worker-mailer'
import { PasswordProvider } from "@openauthjs/openauth/provider/password"
import { PasswordUI } from "@openauthjs/openauth/ui/password"
import { CoreUser } from "@badbird/db"

interface Env {
  CloudflareAuthKV: KVNamespace
  DATABASE_URL: string
  SMTP_HOST: string
  SMTP_PORT: string
  SMTP_USER: string
  SMTP_PASS: string
  SMTP_FROM: string
}

let db: ReturnType<typeof createDb> | null = null

const theme: Theme = {
  title: "Badbird",
  radius: "md",
  primary: "#3585fc",
  background: "#fafafa",
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    if (!db) {
      db = createDb({
        DATABASE_URL: env.DATABASE_URL,
      })
    }

    async function getUser(email: string): Promise<CoreUser | undefined> {
      let user = await db!.query.coreUsers.findFirst({
        where: (user, { eq }) => eq(user.email, email),
      })

      if (!user) {
        return (await db!.insert(coreUsers).values({
          email: email,
        }).returning())[0]
      }
      
      return user;
    }

    return issuer({
      theme,
      storage: CloudflareStorage({
        namespace: env.CloudflareAuthKV,
      }),
      subjects,
      providers: {
        password: PasswordProvider(
          PasswordUI({
            sendCode: async (email, code) => {
              let mailer = null;
              try {
                mailer = await WorkerMailer.connect({
                  credentials: {
                    username: env.SMTP_USER,
                    password: env.SMTP_PASS,
                  },
                  host: env.SMTP_HOST,
                  port: parseInt(env.SMTP_PORT),
                  authType: 'plain',
                  secure: true,
                });
                await mailer.send({
                  from: env.SMTP_FROM,
                  to: email,
                  subject: "Your Authentication Code for badbird.dev",
                  text: `Your authentication code is: ${code}`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #3585fc;">Authentication Code</h2>
                      <p>Your authentication code is:</p>
                      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
                        ${code}
                      </div>
                      <p>This code will expire shortly. If you didn't request this code, please ignore this email.</p>
                    </div>
                  `,
                });
                console.log(`Verification code sent to ${email}`);
              } catch (error) {
                console.error("Failed to send email:", error);
                throw new Error("Failed to send verification code");
              } finally {
                // Close the connection if it was created
                if (mailer) {
                  try {
                    await mailer.close();
                  } catch (closeError) {
                    console.error("Failed to close mailer connection:", closeError);
                  }
                }
              }
            },
            validatePassword: (password) => {
              if (password.length < 8) {
                return "Password must be at least 8 characters"
              }
              return undefined
            },
          }),
        ),
        google: GoogleProvider({
          clientID: "test",
          clientSecret: "test",
          scopes: []
        }),
      },
      success: async (ctx, value) => {
        if (value.provider === "password") {
          const user = await getUser(value.email)
          if (!user) {
            throw new Error("Failed to create or retrieve user");
          }
          
          return ctx.subject("user", {
            id: user.id,
            email: user.email,
            admin: user.admin,
          })
        }
        throw new Error("Invalid provider")
      },
      
      ttl: {
        reuse: 61 // https://github.com/openauthjs/openauth/issues/133
      }
    }).fetch(request, env, ctx)
  },
}