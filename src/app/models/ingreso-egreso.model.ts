export class IngresoEgreso {
  constructor(
    public userUid: string,
    public description: string,
    public amount: number,
    public type: string,
    public uid?: string
  ) {}
}
