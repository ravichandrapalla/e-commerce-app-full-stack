import { type ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import UserAvatar from "../components/ui/UserAvatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useUpdateProfile } from "../features/auth/auth.hooks";
import { setUser } from "../features/auth/auth.slice";
import { toAuthUser } from "../types/auth";
import type { RootState } from "../store/store";
import PageContainer from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/typography";
import { copy } from "../constants/copy";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateProfile = useUpdateProfile();
  const labels = copy.profile;

  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  if (!user) return null;

  const displayAvatar = previewUrl || user.avatarUrl;

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setAvatarFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      if (name.trim() && name.trim() !== user.name) {
        formData.append("name", name.trim());
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      if (!formData.has("name") && !formData.has("avatar")) {
        toast.message(labels.noChanges);
        return;
      }

      const res = await updateProfile.mutateAsync(formData);
      dispatch(setUser(toAuthUser(res.data.user)));
      setAvatarFile(null);
      toast.success(labels.success);
    } catch {
      toast.error(labels.error);
    }
  };

  return (
    <PageContainer className="py-8 sm:py-10">
      <div className="mx-auto max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        <PageHeader
          eyebrow={labels.eyebrow}
          title={labels.title}
          description={labels.description}
          className="mb-8"
        />

        <form onSubmit={handleSubmit} className="section-surface space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <UserAvatar
              name={user.name}
              avatarUrl={displayAvatar}
              size="lg"
              className="ring-4 ring-muted"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <label
                htmlFor="avatar"
                className="inline-flex cursor-pointer rounded-md border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                {labels.changePhoto}
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
              />
              <p className="text-xs text-muted-foreground">{labels.photoHint}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              {labels.displayName}
            </label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{labels.email}</label>
            <Input value={user.email} disabled />
          </div>

          <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto">
            {updateProfile.isPending ? labels.saving : labels.save}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
