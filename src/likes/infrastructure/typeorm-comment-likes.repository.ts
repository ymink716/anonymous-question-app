import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentLikesRepository } from "../domain/repository/comment-likes.repository";
import { CommentLikeEntity } from "./entity/comment-like.entity";
import { CommentLike } from "../domain/comment.like";
import { CommentLikeMapper } from "./mapper/comment-like.mapper";

@Injectable()
export class TypeormCommentLikesRepository implements CommentLikesRepository {
  constructor(
    @InjectRepository(CommentLikeEntity)
    private readonly commentLikesRepository: Repository<CommentLikeEntity>,
  ) {}

  async count(userId: number, commentId: number): Promise<number> {
    const commentLikesCount = await this.commentLikesRepository.count({
      relations: {
        user: true,
        comment: true,
      },      
      where: {
        user: {
          id: userId,
        },
        comment: {
          id: commentId,
        }
      },
    });

    return commentLikesCount;
  }

  async save(commentLike: CommentLike): Promise<CommentLike> {
    const savedCommentLikeEntity = await this.commentLikesRepository.save(
      CommentLikeMapper.toPersistence(commentLike),
    );

    return CommentLikeMapper.toDomain(savedCommentLikeEntity);
  }

  async findByUserIdAndCommentId(userId: number, commentId: number): Promise<CommentLike[]> {
    const commentLikeEntities = await this.commentLikesRepository.find({
      relations: {
        user: true,
        comment: true,
      },      
      where: {
        user: {
          id: userId,
        },
        comment: {
          id: commentId,
        }
      },
    });

    return commentLikeEntities.map((commentLikeEntity) => CommentLikeMapper.toDomain(commentLikeEntity));
  }

  async remove(commentLikes: CommentLike[]): Promise<void> {
    const commentLikeEntities = commentLikes.map((commentLike) => CommentLikeMapper.toPersistence(commentLike));

    await this.commentLikesRepository.remove(commentLikeEntities);
  }
}