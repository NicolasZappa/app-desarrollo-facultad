import { Body, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  }
}

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const startAt = Date.now();
    const originalSend = res.send.bind(res);

    res.send = (Body: unknown) => {
      const ms = Date.now() - startAt;
      res.setHeader("X-Response-Time", `${ms}ms`);
      return originalSend(Body);
    };
    next();
  }
}
