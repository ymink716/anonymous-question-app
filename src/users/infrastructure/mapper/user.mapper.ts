import { User } from "src/users/domain/user";
import { UserEntity } from "../entity/user.entity";
import { Provider } from "src/users/domain/provider";
import { Profile } from "src/users/domain/profile";

export class UserMapper {
  public static toDomain(userEntity: UserEntity): User {
    const { id, email, nickname, providerType, providerId, picture, createdAt } = userEntity;

    const profile = new Profile({ nickname, email, picture });
    const provider = new Provider({ providerType, providerId });
    const user = new User({ id, createdAt, profile, provider });

    return user;
  }

  public static toPersistence(user: User): UserEntity {
    const id = user['id'];
    const email = user['email'];
    const providerType = user['provider']['providerType'];
    const providerId = user['provider']['providerId'];
    const nickname = user['profile']['nickname'];
    const picture = user['profile']['picture'];

    const userEntity = new UserEntity();

    if (id) {
      userEntity.id = id;
    }
    userEntity.email = email;
    userEntity.providerType = providerType;
    userEntity.providerId = providerId;
    userEntity.nickname = nickname;
    userEntity.picture = picture;

    return userEntity;
  }
}