import { ICommand } from "@nestjs/cqrs";

export class AddBookmarkCommand implements ICommand {
  constructor(
    readonly questionId: number,
    readonly userId: number,
  ) {}
}