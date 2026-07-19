import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexComponent,
});

function AdminIndexComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin/alerts" });
  }, [navigate]);

  return null;
}
