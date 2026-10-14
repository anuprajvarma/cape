import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export const SessionAndRouterDetails = () => {
  const router = useRouter();
  const session = useSession();
  const params = useParams();
  return { router, session, params };
};
