import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const resetPasswordByEmail = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        newPassword: z.string().min(6).max(72),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    // Find user by email via admin listUsers (paginated lookup)
    let userId: string | null = null;
    let page = 1;
    const perPage = 1000;
    // Simple bounded loop to avoid runaway iteration
    for (let i = 0; i < 5 && !userId; i++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });
      if (error) {
        return { ok: false as const, error: "Erro ao localizar conta." };
      }
      const match = list.users.find(
        (u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
      );
      if (match) {
        userId = match.id;
        break;
      }
      if (list.users.length < perPage) break;
      page++;
    }

    if (!userId) {
      return { ok: false as const, error: "Conta não encontrada." };
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: data.newPassword },
    );
    if (updateError) {
      return { ok: false as const, error: "Não foi possível alterar a senha." };
    }
    return { ok: true as const };
  });
