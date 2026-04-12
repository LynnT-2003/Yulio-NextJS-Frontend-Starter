"use client";

import { useModerationPageVm } from "@/modules/admin/moderation/viewModel/moderationPageVm";
import { ModerationPageView } from "@/modules/admin/moderation/view/ModerationPageView";

export default function AdminModerationPage() {
  const vm = useModerationPageVm();
  return <ModerationPageView vm={vm} />;
}
