import { AppMain } from "../AppMain"
import { firebase } from "../utils"
import { useEffect } from "react"
import { useFirebaseUserInfo, useUserProfile } from "../utils/query";
import { AppBar } from "../components/AppBar";
import { EmailVerificationPage } from "./EmailVerificationPage";
import { useAppRouter } from "../utils/store";
import { Container } from "@mantine/core";
import { Dashboard } from "./Dashboard";
import { Role } from "../utils/types";
import { canAccessPage, setPagePermissions } from "../utils/permissions";
import { LoadingScreen } from "../components/LoadingScreen";

export const AppPage = () => {

  const { user, hasLoaded } = useFirebaseUserInfo()
  const { currentPage, navigate } = useAppRouter()
  const emailVerified = firebase.auth.currentUser?.emailVerified ?? false
  const this_user = useUserProfile()

  // Definisci le pagine con i loro permessi
  const pagesWithPermissions = {
    "verify-email": { component: <EmailVerificationPage user={user!} />, minRole: Role.ATTENDEE },
    "app": { component: this_user.data ? <Dashboard user={this_user.data} /> : <LoadingScreen message="Caricamento dashboard" showHeader={false} />, minRole: Role.STAFF },
    "qrscan": { component: <div />, minRole: Role.STAFF },
    "not-allowed": { component: <div className="text-2xl">You are not allowed to access this page</div>, minRole: Role.ATTENDEE },
  }

  // Registra i permessi al primo caricamento
  useEffect(() => {
    const pagePermissions: Record<string, Role> = {}
    Object.entries(pagesWithPermissions).forEach(([pageId, { minRole }]) => {
      pagePermissions[pageId] = minRole
    })
    setPagePermissions(pagePermissions)
  }, [])

  useEffect(() => {
    if (hasLoaded) {
      if (user == null) {
        location.href = "/login"
      }
      if (user && !emailVerified && currentPage !== "verify-email") {
        navigate("verify-email")
      }
    }
    if (this_user.isFetched) {
      const role = this_user.data?.role ?? Role.ATTENDEE
      if (!canAccessPage(role, currentPage)) {
        navigate("not-allowed")
      }
    }
  }, [user, hasLoaded, this_user.isFetching])

  return <div className="flex flex-col h-full w-full justify-start" style={{ minHeight: "100vh" }
  } >
    <AppBar />
    <div className="text-center mx-5">
      <AppMain>
        <Container size="xl" mt="xl">
          {this_user.isFetched && (pagesWithPermissions[currentPage]?.component || <LoadingScreen message="Caricamento pagina" showHeader={false} />) || <LoadingScreen message="Caricamento" showHeader={false} />}
        </Container>
      </AppMain>
    </div>
  </div >
}
