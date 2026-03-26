"use client";

import { useEffect, useState } from 'react';
import { 
    ShieldCheck, Plus, Edit, Trash2, Search, XCircle, Loader2, Check
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy 
} from 'firebase/firestore';
import { UserRole, PERMISSIONS } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function RoleManagement() {
    const { hasPermission } = useAuth();
    const [roles, setRoles] = useState<UserRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRoleForm, setShowRoleForm] = useState(false);
    const [editingRole, setEditingRole] = useState<UserRole | null>(null);
    const [formData, setFormData] = useState<Partial<UserRole>>({
        name: '',
        permissions: []
    });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'roles'), orderBy('name', 'asc'));
            const querySnapshot = await getDocs(q);
            const rolesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserRole[];
            setRoles(rolesData);
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = (permission: string) => {
        setFormData(prev => {
            const currentPermissions = prev.permissions || [];
            if (currentPermissions.includes(permission)) {
                return { ...prev, permissions: currentPermissions.filter(p => p !== permission) };
            } else {
                return { ...prev, permissions: [...currentPermissions, permission] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await updateDoc(doc(db, 'roles', editingRole.id), formData);
            } else {
                await addDoc(collection(db, 'roles'), formData);
            }
            setShowRoleForm(false);
            setEditingRole(null);
            setFormData({ name: '', permissions: [] });
            fetchRoles();
        } catch (error) {
            console.error("Error saving role:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (id === 'super_admin') return; // Cannot delete super admin
        if (window.confirm('Are you sure you want to delete this role? Users assigned to this role will lose access.')) {
            try {
                await deleteDoc(doc(db, 'roles', id));
                setRoles(prev => prev.filter(r => r.id !== id));
            } catch (error) {
                console.error("Error deleting role:", error);
            }
        }
    };

    if (!hasPermission(PERMISSIONS.MANAGE_ROLES)) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <ShieldCheck className="w-16 h-16 text-gray-200 mb-4" />
                <h2 className="text-xl font-serif-elegant text-dark-brown">Access Denied</h2>
                <p className="text-gray-400">You don't have permission to manage roles.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif-elegant text-dark-brown">Role Management</h2>
                    <p className="text-sm text-gray-500">Define permissions and access levels for your team.</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingRole(null);
                        setFormData({ name: '', permissions: [] });
                        setShowRoleForm(true);
                    }}
                    className="flex items-center gap-2 bg-olive-green text-white px-6 py-3 rounded-2xl hover:bg-dark-brown transition-all font-bold text-sm shadow-warm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Role</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-10 h-10 text-olive-green animate-spin" />
                    </div>
                ) : (
                    roles.map((role) => (
                        <div key={role.id} className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-100 hover:border-olive-green/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                                <button 
                                    onClick={() => {
                                        setEditingRole(role);
                                        setFormData(role);
                                        setShowRoleForm(true);
                                    }}
                                    className="p-2 bg-gray-50 rounded-xl hover:bg-olive-green/10 text-gray-400 hover:text-olive-green"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(role.id)}
                                    className="p-2 bg-gray-50 rounded-xl hover:bg-deep-red/10 text-gray-400 hover:text-deep-red"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="w-12 h-12 bg-olive-green/10 rounded-2xl flex items-center justify-center text-olive-green mb-6">
                                <ShieldCheck className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold text-dark-brown mb-2">{role.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {role.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-bold uppercase tracking-tighter">
                                        {p.replace('_', ' ')}
                                    </span>
                                ))}
                                {role.permissions.length > 3 && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-400 font-bold">
                                        +{role.permissions.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Role Form Modal */}
            {showRoleForm && (
                <div className="fixed inset-0 bg-dark-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-serif-elegant text-dark-brown">
                                    {editingRole ? 'Edit Role' : 'Create New Role'}
                                </h3>
                                <p className="text-sm text-gray-500">Define what this role can see and do.</p>
                            </div>
                            <button
                                onClick={() => setShowRoleForm(false)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Role Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Senior Editor"
                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-olive-green transition-all outline-none font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Permissions</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Object.values(PERMISSIONS).map((permission) => (
                                            <button
                                                key={permission}
                                                type="button"
                                                onClick={() => handlePermissionToggle(permission)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                                    formData.permissions?.includes(permission)
                                                        ? 'bg-olive-green/5 border-olive-green text-olive-green'
                                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                                }`}
                                            >
                                                <span className="text-xs font-bold uppercase tracking-tight">
                                                    {permission.split('_').join(' ')}
                                                </span>
                                                {formData.permissions?.includes(permission) && (
                                                    <Check className="w-4 h-4" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="hidden" id="role-submit" />
                            </form>
                        </div>

                        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/30">
                            <button
                                onClick={() => setShowRoleForm(false)}
                                className="px-8 py-3 rounded-2xl border border-gray-200 font-bold text-gray-500"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => document.getElementById('role-submit')?.click()}
                                className="px-10 py-3 bg-dark-brown text-white rounded-2xl font-bold hover:bg-terracotta transition-all shadow-warm"
                            >
                                {editingRole ? 'Update Role' : 'Save Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
