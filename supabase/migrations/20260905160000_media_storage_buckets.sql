-- Private album + voice storage; owner-scoped paths

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'album-photos',
  'album-photos',
  false,
  15728640,
  array['image/jpeg', 'image/jpg', 'image/webp', 'image/png', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voice-notes',
  'voice-notes',
  false,
  10485760,
  array['audio/webm', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- album-photos: {user_id}/...
create policy "album_photos_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'album-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "album_photos_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'album-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "album_photos_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'album-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'album-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "album_photos_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'album-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- voice-notes owner prefix
create policy "voice_notes_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'voice-notes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "voice_notes_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'voice-notes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "voice_notes_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'voice-notes'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'voice-notes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "voice_notes_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'voice-notes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Grandparent invite uploads: invites/{token}/file
create policy "voice_notes_invite_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'voice-notes'
    and (storage.foldername(name))[1] = 'invites'
  );

create policy "voice_notes_invite_select_owner"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'voice-notes'
    and (storage.foldername(name))[1] = 'invites'
    and exists (
      select 1 from public.voice_profiles vp
      where vp.owner_user_id = auth.uid()
        and vp.invite_token = (storage.foldername(name))[2]
    )
  );
