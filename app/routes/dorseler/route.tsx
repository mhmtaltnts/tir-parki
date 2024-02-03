import type { Dorse } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import { useEffect, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import { Label } from "~/components/ui/label";

import { getDorseList } from "~/models/dorse.server";
//import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { DorseCard } from "./dorse-card";
import { ModeToggle } from "~/components/mode-toggle";
import { useTheme } from "next-themes";

export const loader = async ({ request }: LoaderArgs) => {
  //const userId = await requireUserId(request);
  const { searchParams } = new URL(request.url);
  const dorseList = await getDorseList();

  const q = searchParams.get("q");

  const dorseFiltered = q
    ? dorseList.filter((dorse) =>
        dorse.plaka.toLowerCase().includes(q?.toLowerCase() || "")
      )
    : dorseList;

  return json({ dorseFiltered, q });
};

/* export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const plaka = formData.get("plaka");
  const firma = formData.get("firma");

  if (typeof plaka !== "string" || plaka.length === 0) {
    return json(
      { errors: { firma: null, plaka: "Plaka gerekli" } },
      { status: 400 },
    );
  }

  if (typeof firma !== "string" || firma.length === 0) {
    return json(
      { errors: { firma: "Firma gerekli", plaka: null } },
      { status: 400 },
    );
  }
  const dorse = await createDorse({ plaka, firma, userId });

  return redirect(`dorses/${dorse.id}`);
}; */

export default function DorsesPage() {
  const { theme } = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);
  const { dorseFiltered, q } = useLoaderData();
  const user = useUser();
  const submit = useSubmit();
  const navigation = useNavigation();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    if (searchRef.current !== null) {
      searchRef.current.value = q;
    }
  }, [q]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-bold">
          <Link to=".">Dorseler</Link>
        </h1>
        <p>{user.email}</p>
        <div className="flex flex-row gap-2">
          <Form action="/logout" method="post">
            <button type="submit" className="rounded px-4 py-2">
              Çıkış
            </button>
          </Form>
          <ModeToggle />
        </div>
      </header>

      <main className="flex w-full flex-row items-start justify-start">
        <div className="flex flex-col items-center justify-start">
          <div className="flex w-full items-center justify-start">
            <Form id="search-form" role="search">
              <div className="group m-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 hover:border-blue-900">
                <Label htmlFor="q">
                  {searching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search />
                  )}
                </Label>
                <input
                  className="group-hover: border-black-500 outline-none"
                  ref={searchRef}
                  id="q"
                  aria-label="Search contacts"
                  placeholder="Search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  onChange={(event) => {
                    const isFirstSearch = q == null;
                    submit(event.currentTarget.form, {
                      replace: !isFirstSearch,
                    });
                  }}
                />
              </div>
            </Form>
            <Link to="new">Yeni</Link>
          </div>
          <div className="w-120 overflow-scroll border-r">
            {dorseFiltered.length === 0 ? (
              <p className="p-4">Henüz kayıtlı dorse yok</p>
            ) : (
              <ol>
                {dorseFiltered.map((dorse: Dorse) => (
                  <li key={dorse.id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block border-b p-4 text-xl ${
                          isActive
                            ? theme === "dark"
                              ? "bg-white"
                              : "bg-black"
                            : ""
                        }`
                      }
                      to={dorse.id}
                    >
                      <DorseCard
                        role={user.role}
                        id={dorse.id}
                        plaka={dorse.plaka}
                        firma={dorse.firma}
                        createdAt={dorse.createdAt}
                      />
                    </NavLink>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-start p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
