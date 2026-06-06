import { ref, computed } from 'vue'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const user = ref(null)
const isAdmin = ref(false)
const authReady = ref(false)
const authError = ref(null)

let initPromise = null

async function checkAdmin(uid) {
  const snap = await getDoc(doc(db, 'admins', uid))
  return snap.exists()
}

function initAuth() {
  if (initPromise) return initPromise

  initPromise = new Promise((resolve) => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser
      authError.value = null

      if (firebaseUser) {
        try {
          isAdmin.value = await checkAdmin(firebaseUser.uid)
          if (!isAdmin.value) {
            authError.value = 'Esta conta não tem permissão de administrador.'
            await signOut(auth)
            user.value = null
          }
        } catch {
          isAdmin.value = false
          authError.value = 'Erro ao verificar permissões.'
          await signOut(auth)
          user.value = null
        }
      } else {
        isAdmin.value = false
      }

      authReady.value = true
      resolve()
    })
  })

  return initPromise
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(user.value && isAdmin.value))

  async function login(email, password) {
    authError.value = null
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const allowed = await checkAdmin(credential.user.uid)

    if (!allowed) {
      await signOut(auth)
      authError.value = 'Esta conta não tem permissão de administrador.'
      throw new Error(authError.value)
    }

    isAdmin.value = true
    user.value = credential.user
  }

  async function logout() {
    await signOut(auth)
    user.value = null
    isAdmin.value = false
  }

  return {
    user,
    isAdmin,
    authReady,
    authError,
    isAuthenticated,
    initAuth,
    login,
    logout,
  }
}
