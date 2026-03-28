"use client";

import { useEffect, useState } from 'react';
import { 
    Users, Plus, Edit, Trash2, Search, XCircle, Loader2, UserPlus, ShieldCheck, Mail, Calendar
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
    collection, getDocs, updateDoc, doc, query, orderBy 
} from 'firebase/firestore';
import { UserAccount, UserRole, PERMISSIONS } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function UserManagement() {
    const { hasPermission } = useAuth();
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersSnap, rolesSnap] = await Promise.all([
                getDocs(query(collection(db, 'users'), orderBy('email', 'asc'))),
                getDocs(query(collection(db, 'roles'), orderBy('name', 'asc')))
            ]);

            const usersData = usersSnap.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            })) as any as UserAccount[];

            const rolesData = rolesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserRole[];

            setUsers(usersData);
            setRoles(rolesData);
        } catch (error) {
            console.error("Error fetching user management data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async () => {
        if (!editingUser || !selectedRoleId) return;

        try {
            const userRef = doc(db, 'users', editingUser.uid);
            await updateDoc(userRef, { roleId: selectedRoleId });
            
            // Update local state
            setUsers(prev => prev.map(u => 
                u.uid === editingUser.uid ? { ...u, roleId: selectedRoleId } : u
            ));
            
            setEditingUser(null);
            setSelectedRoleId('');
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    const filteredUsers = users.filter(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!hasPermission(PERMISSIONS.MANAGE_USERS)) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Users className="w-16 h-16 text-gray-200 mb-4" />
                <h2 className="text-xl font-serif-elegant text-dark-brown">Access Denied</h2>
                <p className="text-gray-400">You don't have permission to manage users.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif-elegant text-dark-brown">User Management</h2>
                    <p className="text-sm text-gray-500">Assign roles and manage administrative access.</p>
                </div>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-olive-green/20 outline-none font-medium shadow-soft"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-soft border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Role</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-olive-green animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => {
                                const userRole = user.roleId === 'super_admin' 
                                    ? { name: 'Super Admin' } 
                                    : roles.find(r => r.id === user.roleId) || { name: 'Viewer' };

                                return (
                                    <tr key={user.uid} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-olive-green/10 rounded-full flex items-center justify-center text-olive-green font-bold text-sm">
                                                    {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <p className="font-bold text-dark-brown text-sm">{user.displayName || 'Unnamed User'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">{user.email}</td>
                                        <td className="px-8 py-5">
                                            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${
                                                user.roleId === 'super_admin' 
                                                    ? 'bg-deep-red text-white' 
                                                    : 'bg-olive-green/10 text-olive-green'
                                            }`}>
                                                {userRole.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button 
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setSelectedRoleId(user.roleId);
                                                }}
                                                className="p-2.5 hover:bg-white hover:shadow-soft rounded-xl transition-all text-gray-400 hover:text-olive-green"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Assignment Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-dark-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-serif-elegant text-dark-brown">Assign Role</h3>
                                <p className="text-sm text-gray-500">Update access level for this user.</p>
                            </div>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-olive-green font-bold shadow-sm">
                                    {(editingUser.displayName?.[0] || editingUser.email?.[0] || 'U').toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-dark-brown truncate">{editingUser.displayName}</p>
                                    <p className="text-xs text-gray-400 truncate">{editingUser.email}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select New Role</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    <button
                                        onClick={() => setSelectedRoleId('super_admin')}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                            selectedRoleId === 'super_admin'
                                                ? 'bg-deep-red/5 border-deep-red text-deep-red'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-5 h-5" />
                                            <span className="font-bold text-sm">Super Admin</span>
                                        </div>
                                    </button>

                                    {roles.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => setSelectedRoleId(role.id)}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                                selectedRoleId === role.id
                                                    ? 'bg-olive-green/5 border-olive-green text-olive-green'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="w-5 h-5" />
                                                <span className="font-bold text-sm">{role.name}</span>
                                            </div>
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setSelectedRoleId('viewer')}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                            selectedRoleId === 'viewer'
                                                ? 'bg-gray-100 border-gray-300 text-gray-600'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5" />
                                            <span className="font-bold text-sm">Viewer</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50/50 flex flex-col gap-3">
                            <button 
                                onClick={handleRoleUpdate}
                                className="w-full py-4 bg-dark-brown text-white rounded-2xl font-bold hover:bg-terracotta transition-all shadow-warm active:scale-95"
                            >
                                Confirm Role Change
                            </button>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="w-full py-4 rounded-2xl border border-gray-200 bg-white font-bold text-gray-500 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
