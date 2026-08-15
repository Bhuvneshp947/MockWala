import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  History,
  ImageUp,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileFileInput = useRef<HTMLInputElement | null>(null);
  const [theme, setTheme] = useState<"default" | "light" | "dark">("default");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("/image1.png");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("prepSmartTheme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    const savedAvatar = window.localStorage.getItem("prepSmartProfileImage");
    if (savedAvatar) {
      setProfileImage(savedAvatar);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    window.localStorage.setItem("prepSmartTheme", theme);
  }, [theme]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function onProfileImagePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setProfileImage(result);
        window.localStorage.setItem("prepSmartProfileImage", result);
      }
    };
    reader.readAsDataURL(file);
  }

  const profileObject = session?.user?.user_metadata ?? {};
  const storedImage =
    typeof profileObject.avatar_url === "string" && profileObject.avatar_url.trim()
      ? profileObject.avatar_url
      : typeof profileObject.avatar === "string" && profileObject.avatar.trim()
        ? profileObject.avatar
        : profileImage;

  const fullName =
    typeof session?.user?.user_metadata?.full_name === "string"
      ? session.user.user_metadata.full_name.trim()
      : "";

  const profileLabel = useMemo(() => {
    if (fullName) return fullName;
    return "Student";
  }, [fullName]);

  const profileInitials = useMemo(() => {
    if (!fullName) return "SP";
    const words = fullName.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return words[0]!.slice(0, 2).toUpperCase();
    }
    return `${words[0]![0] ?? ""}${words[1]![0] ?? ""}`.toUpperCase();
  }, [fullName]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground shadow-card font-bold text-sm">
            MW
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Mock<span className="text-gradient-accent">Wala</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Exams
          </Link>
          {loading ? null : session ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={storedImage} alt={profileLabel} />
                      <AvatarFallback>{profileInitials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={storedImage} alt={profileLabel} />
                      <AvatarFallback>{profileInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{profileLabel}</div>
                      <div className="text-xs text-muted-foreground">MockWala learner</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="size-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <History className="size-4" /> Result history
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSettingsOpen(true)}>
                    <span className="flex items-center gap-2">
                      <Settings className="size-4" /> Account settings
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => profileFileInput.current?.click()}>
                    <span className="flex items-center gap-2">
                      <ImageUp className="size-4" /> Upload profile image
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span className="flex items-center gap-2">
                      <Sun className="size-4" /> Default theme
                    </span>
                    <span className="ml-auto flex gap-1">
                      <Button
                        type="button"
                        variant={theme === "default" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setTheme("default")}
                      >
                        Auto
                      </Button>
                      <Button
                        type="button"
                        variant={theme === "light" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant={theme === "dark" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="size-3.5" />
                      </Button>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="size-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>

      <input
        ref={profileFileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onProfileImagePicked}
      />

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account settings</DialogTitle>
            <DialogDescription>
              Update your profile, exam focus and visual preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={storedImage} alt={profileLabel} />
                <AvatarFallback>{profileInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{profileLabel}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email ?? "Student"}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => profileFileInput.current?.click()}>
              <ImageUp className="size-4" /> Pick a custom image
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => setSettingsOpen(false)}>
              Close settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
