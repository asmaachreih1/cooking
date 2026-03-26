"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    User,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserAccount, UserRole, PERMISSIONS } from '@/types';

interface AuthContextType {
    user: User | null;
    account: UserAccount | null;
    role: UserRole | null;
    loading: boolean;
    logout: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    account: null,
    role: null,
    loading: true,
    logout: async () => {},
    hasPermission: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [account, setAccount] = useState<UserAccount | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    const SUPER_ADMIN_EMAIL = 'asmaachreih@gmail.com';

    useEffect(() => {
        let unsubscribeUser: () => void = () => {};
        let unsubscribeRole: () => void = () => {};

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            // Clean up previous listeners
            unsubscribeUser();
            unsubscribeRole();

            if (firebaseUser) {
                setUser(firebaseUser);
                
                // Real-time User Account Listener
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                unsubscribeUser = onSnapshot(userDocRef, async (userDoc) => {
                    let userData: UserAccount;

                    if (!userDoc.exists()) {
                        userData = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || 'User',
                            roleId: firebaseUser.email === SUPER_ADMIN_EMAIL ? 'super_admin' : 'viewer',
                            createdAt: new Date()
                        };
                        await setDoc(userDocRef, userData);
                    } else {
                        userData = userDoc.data() as UserAccount;
                    }

                    setAccount(userData);

                    // Real-time Role Listener (Dynamic)
                    if (userData.roleId === 'super_admin') {
                        setRole({
                            id: 'super_admin',
                            name: 'Super Admin',
                            permissions: Object.values(PERMISSIONS)
                        });
                        setLoading(false);
                    } else {
                        unsubscribeRole(); // Clean up previous role listener if any
                        unsubscribeRole = onSnapshot(doc(db, 'roles', userData.roleId), (roleDoc) => {
                            if (roleDoc.exists()) {
                                const roleData = { id: roleDoc.id, ...roleDoc.data() } as UserRole;
                                console.log("AuthContext: Role loaded:", roleData);
                                setRole(roleData);
                            } else {
                                console.warn("AuthContext: Role not found in Firestore:", userData.roleId);
                                setRole({
                                    id: 'viewer',
                                    name: 'Viewer',
                                    permissions: []
                                });
                            }
                            setLoading(false);
                        });
                    }
                }, (error) => {
                    console.error("AuthContext: User account listener error:", error);
                    setLoading(false);
                });
            } else {
                setUser(null);
                setAccount(null);
                setRole(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeUser();
            unsubscribeRole();
        };
    }, []);

    const hasPermission = (permission: string) => {
        if (!role) return false;
        return role.permissions.includes(permission);
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, account, role, loading, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
