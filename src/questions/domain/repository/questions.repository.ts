import { Question } from "../question";

export interface QuestionsRepository {
  findOneById(id: number): Promise<Question | null>;
  save(question: Question): Promise<Question>;
  findAll(): Promise<Question[]>;
  softDelete(id: number): Promise<void>;
}