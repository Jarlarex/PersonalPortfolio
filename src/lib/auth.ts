import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Sign in with email and password
 *
 * @param email - User's email
 * @param password - User's password
 * @returns Promise resolving to UserCredential
 *
 * @example
 * ```typescript
 * try {
 *   const user = await signIn('user@example.com', 'password123');
 *   console.log('Signed in:', user.uid);
 * } catch (error) {
 *   console.error('Sign in failed:', error.message);
 * }
 * ```
 */
export async function signIn(
  email: string,
  password: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error: unknown) {
    // Re-throw with user-friendly message
    if (error instanceof Error) {
      const errorCode = (error as { code?: string }).code;

      switch (errorCode) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled');
        case 'auth/user-not-found':
          throw new Error('No account found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/invalid-credential':
          throw new Error('Invalid email or password');
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later');
        default:
          throw new Error(error.message || 'Failed to sign in');
      }
    }
    throw new Error('Failed to sign in');
  }
}

/**
 * Sign out the current user
 *
 * @returns Promise that resolves when sign out is complete
 *
 * @example
 * ```typescript
 * await signOut();
 * router.push('/');
 * ```
 */
export async function signOut(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }

  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
}

/**
 * Get the currently signed-in user
 *
 * @returns Current user or null if not signed in
 *
 * @example
 * ```typescript
 * const user = getCurrentUser();
 * if (user) {
 *   console.log('Signed in as:', user.email);
 * }
 * ```
 */
export function getCurrentUser(): User | null {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 *
 * @param callback - Function called when auth state changes
 * @returns Unsubscribe function
 *
 * @example
 * ```typescript
 * const unsubscribe = onAuthStateChange((user) => {
 *   if (user) {
 *     console.log('User signed in:', user.email);
 *   } else {
 *     console.log('User signed out');
 *   }
 * });
 *
 * // Later: unsubscribe();
 * ```
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

/**
 * Check if a user is currently authenticated
 *
 * @returns Promise that resolves to true if user is authenticated
 *
 * @example
 * ```typescript
 * const isAuth = await isAuthenticated();
 * if (!isAuth) {
 *   router.push('/login');
 * }
 * ```
 */
export function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}

/**
 * Wait for auth to be ready
 * Useful for ensuring auth state is loaded before checking authentication
 *
 * @returns Promise that resolves when auth is ready
 */
export function waitForAuth(): Promise<User | null> {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

