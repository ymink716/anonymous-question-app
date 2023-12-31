// import { UsersRepository } from "../domain/repository/users.repository";
// import { User } from "../domain/user";

// export class TestUsersRepository implements UsersRepository {
//   private nextId = 1;
//   private users: User[] = [];

//   async findOneById(id: number) {
//     const user = this.users.find(user => user.id === id);

//     if (!user) {
//       return null;
//     }

//     return user;
//   }

//   async findByProviderId(providerId: string) {
//     const user = this.users.find(user => user.providerId === providerId);

//     if (!user) { 
//       return null;
//     }

//     return user;
//   }

//   async save(user: User) {
//     user.id = this.nextId++;
//     this.users.push(user);

//     return user;
//   }

//   reset() {
//     this.nextId = 1;
//     this.users = [];
//   }
// }