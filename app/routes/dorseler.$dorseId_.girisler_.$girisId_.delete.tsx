import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, isRouteErrorResponse, useRouteError } from "@remix-run/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import invariant from "tiny-invariant";

import { prisma } from "~/db.server";

export const action = async ({ params, request }: ActionArgs) => {
  const formData = request.formData();
  const intent = (await formData).get("intent");

  invariant(params.girisId, "Dorse numarası bulunamadı");

  if (intent === "cancel") {
    return redirect(`/dorseler/${params.dorseId}/girisler`);
  }

  if (intent === "destroy") {
    await prisma.giris.delete({ where: { id: params.girisId } });
    return redirect(`/dorseler/${params.dorseId}/girisler`);
  }
};

export default function ConfirmGirisDeleteRoute() {
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Silmek istediğinizden emin misiniz?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem iptal edilemez. Dorseye ait bu giriş kalıcı olarak
            silinecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form method="post">
          <AlertDialogFooter>
            <AlertDialogCancel type="submit" name="intent" value="cancel">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction type="submit" name="intent" value="destroy">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Dorse bulunamadı</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
