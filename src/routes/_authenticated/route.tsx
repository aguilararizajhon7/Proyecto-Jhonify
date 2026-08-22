import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutApp } from "@/diseno/LayoutApp";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/iniciar-sesion" });
    return { user: data.user };
  },
  component: () => (
    <LayoutApp>
      <Outlet />
    </LayoutApp>
  ),
});
