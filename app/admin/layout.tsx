"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (pathname === "/admin/login") {
                setIsAuthenticated(true); // Allow login page to render
                setIsLoading(false);
                return;
            }

            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(c => c.trim().startsWith('admin_auth='));
            if (!authCookie) {
                router.push("/admin/login");
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, [router, pathname]);

    const handleLogout = () => {
        document.cookie = "admin_auth=; path=/; max-age=0";
        router.push("/admin/login");
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // If on login page, just render children without sidebar
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (!isAuthenticated) return null;

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/guests", label: "Convidados", icon: Users },
        { href: "/admin/settings", label: "Configurações", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-white border-r flex-col fixed h-full">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-fuchsia-800">Ingrid 20 Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start ${isActive ? "bg-fuchsia-50 text-fuchsia-700" : ""}`}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-50 px-4 py-3 flex items-center justify-between">
                <h1 className="font-bold text-fuchsia-800">Ingrid 20 Admin</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="p-6 border-b">
                            <h1 className="text-xl font-bold text-fuchsia-800">Menu</h1>
                        </div>
                        <nav className="flex-1 p-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={`w-full justify-start ${isActive ? "bg-fuchsia-50 text-fuchsia-700" : ""}`}
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            {item.label}
                                        </Button>
                                    </Link>
                                );
                            })}
                            <Button variant="ghost" className="w-full justify-start text-red-600 mt-4" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0">
                {children}
            </main>
        </div>
    );
}
