export class User {
  constructor(
    public Name: string,

    public FirstLastName: string,

    public SecondLastName: string,

    public RUT: string,

    public Email: string,

    public CareerId: number,

    public HashedPassword: string,

    public Role: string,
  ) {}

  public changePassword(newHashedPassword: string) {
    this.HashedPassword = newHashedPassword;
  }
}
