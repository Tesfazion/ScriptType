export type TimestampedPreference<T> = {
  value: T;
  updatedAt?: string;
};

export function resolvePreference<T>(
  pending: TimestampedPreference<T> | undefined,
  remote: TimestampedPreference<T> | undefined,
): TimestampedPreference<T> | undefined {
  if (!pending) return remote;
  if (!remote) return pending;

  const pendingTime = pending.updatedAt ? Date.parse(pending.updatedAt) : Number.NaN;
  const remoteTime = remote.updatedAt ? Date.parse(remote.updatedAt) : Number.NaN;
  if (Number.isFinite(pendingTime) && !Number.isFinite(remoteTime)) return pending;
  if (!Number.isFinite(pendingTime) || !Number.isFinite(remoteTime)) return remote;
  return pendingTime > remoteTime ? pending : remote;
}
