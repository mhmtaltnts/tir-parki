import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Slider from "./slider/slider";
import { Button } from "~/components/ui/button";

import { useOptionalUser } from "~/utils";
import { ModeToggle } from "~/components/mode-toggle";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <header className="flex w-full items-center justify-between shadow-xl sm:overflow-hidden sm:rounded-2xl">
        <div className="p-4 text-3xl">
          <Link to="/">Akbaşlar</Link>
        </div>
        <nav>
          <div className="mx-auto max-w-sm sm:flex sm:max-w-none sm:justify-center">
            {user ? (
              <Button variant={"default"}>
                <Link to="/dorseler">Dorseler</Link>
              </Button>
            ) : (
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <Button variant={"outline"}>
                  <Link to="/join">Kayıt</Link>
                </Button>
                <Button variant={"ghost"}>
                  <Link to="/login">Giriş</Link>
                </Button>
              </div>
            )}
            <ModeToggle />
          </div>
        </nav>
      </header>

      <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
        <Slider />
      </main>
    </>
  );
}
