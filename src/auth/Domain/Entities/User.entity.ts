import { Career } from 'src/auth/Infrastructure/Entities/Career.orm.entity';

export class User {
  constructor(
    public Name: string,

    public FirstLastName: string,

    public SecondLastName: string,

    public RUT: string,

    public Email: string,

    public Career: Career,

    public HashedPassword: string,

    public Role: string,
  ) {}

  public changePassword(newHashedPassword: string) {
    this.HashedPassword = newHashedPassword;
  }
}
