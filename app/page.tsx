"use client";

import { useHomePageVm } from "@/modules/home/viewModel/homePageVm";
import { HomePageView } from "@/modules/home/view/HomePageView";

export default function Home() {
  const vm = useHomePageVm();
  return (
    <div className="flex flex-1 flex-col">
      <HomePageView vm={vm} />
    </div>
  );
}
