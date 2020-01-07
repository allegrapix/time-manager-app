export class Task {
  constructor(
    public _id: string,
    public title: string,
    public status: string,
    public workedHours: number,
    public description: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public startedAt?: Date,
    public endedAt?: Date,
    public owner?: string
  ) {}
}