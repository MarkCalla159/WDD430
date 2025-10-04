export class Message {
  constructor(
    public id: string,
    public sender: string,
    public subject: string,
    public msgText: string,
  ) {}
}