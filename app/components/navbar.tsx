import React from "react";
import type { User } from "@prisma/client";
import { Button } from "./ui/button";
import { Link, Form } from "@remix-run/react";

import { ModeToggle } from "./mode-toggle";

const Navbar = ({ user }: { user: User | undefined }) => {
  return (
    <div className="flex w-full items-center justify-between px-1 py-1 lg:px-5 lg:py-2">
      <div>Akbaşlar</div>

      <nav>
        {!user ? (
          <div className="flex items-center justify-center">
            <Link to="/join">
              <Button variant={"secondary"}>Kayıt</Button>
            </Link>

            <Link to="/login">
              <Button variant={"ghost"}>Giriş</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-around">
            <Link to="/dorseler">Dorseler</Link>
            {user.name}

            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Çıkış
              </button>
            </Form>
          </div>
        )}
      </nav>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
