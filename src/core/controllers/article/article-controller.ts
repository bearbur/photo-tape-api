import { CrudController } from '../crud-controller';
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import Article from '../../models/article/article-model';
import httpCodes from '../../constants/http-codes';
import { generateCurrentDateAtMs } from '../../utils/date-utils';
import { loggerCreator } from '../../services/logger/logger';
import { MAX_ERROR_LENGTH, MIN_ERROR_LENGTH } from '../../constants/utils-constants';

/*use id for manipulation with articles*/

export class ArticleController extends CrudController {
    create(
        req: { body: { author_id: string; title: string; content: string } },
        res: Response,
        next: NextFunction
    ): void {
        const { author_id, title, content } = req.body;

        if (!author_id || !title || !content) {
            throw new Error('Precondition failed!');
        }

        const newArticle = new Article({ author_id, title, content });

        newArticle
            .save()
            .then(() => {
                const messageToLog = `New article from ${author_id} was created at ${generateCurrentDateAtMs()}.`;
                loggerCreator.info(messageToLog);
                res.status(httpCodes.successCreation).send({ error: false, message: messageToLog });
            })
            .catch((err: Error) => {
                const errorMessage = `Creation new article error: ${err
                    .toString()
                    .slice(MIN_ERROR_LENGTH, MAX_ERROR_LENGTH)} at ${generateCurrentDateAtMs()}.`;
                loggerCreator.error(errorMessage);
                res.status(httpCodes.conflictAtRequest);
                res.send({ error: true, message: `Creation new article error at ${generateCurrentDateAtMs()}.` });
            });
    }

    read(req: Request, res: Response, next: NextFunction): void {
        /* todo limit by size and maybe pageable feature needed  */

        Article.find({}, {}, { limit: 10 }, (err, docs) => {
            if (err) {
                res.status(httpCodes.badRequest);
                res.send({
                    error: true,
                    message: 'Error on read articles',
                });

                return;
            }

            res.status(httpCodes.success);
            res.send({ error: false, message: 'Articles has been success read.', data: docs });
        });
    }

    update(req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }
}
