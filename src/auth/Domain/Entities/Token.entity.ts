import { User } from './User.entity';

export class Token {
  constructor(
    public Jwt_uuid: string,

    public User: User,

    public Issued_at: Date,

    public Revoked_at: Date | null,

    public Expired_at: Date,
  ) {}

  public Revoke(): void {
    if (this.Revoked_at !== null) {
      throw new Error('This token is already revoked');
    }
    this.Revoked_at = new Date();
  }

  public IsRevoked(): boolean {
    if (this.Revoked_at === null) {
      return false;
    }
    return true;
  }

  public HasExpired(): boolean {
    if (new Date() <= this.Expired_at) {
      return false;
    }
    return true;
  }
}
