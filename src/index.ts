/**
 * Host-side bundle entry. The companion itself runs exclusively in the
 * declared browser client extension and uses public UI services only.
 */
export const name = 'tobewin-dsh-pet-companion';

export function apply(): void {
  // Client-only plugin: no Harness source, profile, or server mutation.
}
