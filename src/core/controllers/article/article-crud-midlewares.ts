import { NextFunction, Request, Response } from 'express';
import { ArticleController } from './article-controller';

export const readLastPublicArticles = (req: Request, res: Response, next: NextFunction) => {
    const articleController = new ArticleController();

    articleController.read(req, res, next);
};

export const createPublicArticle = (req: Request, res: Response, next: NextFunction) => {
    const articleController = new ArticleController();

    articleController.create(req, res, next);
};
