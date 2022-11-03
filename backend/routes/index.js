import { Router } from 'express';
import passport from 'passport';

import { login } from './controllers/auth';
import * as users from './controllers/users';
import * as investigations from './controllers/investigations';
import * as locations from './controllers/locations';
import * as indexes from './controllers/indexes';
import * as invoices from './controllers/invoices';
import * as usage from './controllers/usage';
import * as bills from './controllers/bills';
import * as meterChange from './controllers/meter-change';

const rootRouter = new Router();
rootRouter.post('/login', login);

const apiRouter = new Router();
apiRouter.use(passport.authenticate('jwt', { session: false }));

const usersRouter = new Router();
usersRouter.get('/current', users.current);
apiRouter.use('/users', usersRouter);

const investigationsRouter = new Router();
investigationsRouter.get('/', investigations.get);
investigationsRouter.get('/:id', investigations.getSingle);
apiRouter.use('/investigations', investigationsRouter);

const locationsRouter = new Router();
locationsRouter.get('/', locations.get);
locationsRouter.get('/:id', locations.getSingle);
apiRouter.use('/locations', locationsRouter);

const indexesRouter = new Router();
indexesRouter.get('/', indexes.get);
indexesRouter.get('/:id', indexes.getSingle);
apiRouter.use('/indexes', indexesRouter);

const invoicesRouter = new Router();
invoicesRouter.get('/', invoices.get);
invoicesRouter.get('/:id', invoices.getSingle);
apiRouter.use('/invoices', invoicesRouter);

const meterChangeRouter = new Router();
meterChangeRouter.get('/', meterChange.get);
apiRouter.use('/meter-change', meterChangeRouter);

const usageRouter = new Router();
usageRouter.get('/', usage.get);
usageRouter.get('/:id', usage.getSingle);
apiRouter.use('/usage', usageRouter);

const billsRouter = new Router();
billsRouter.get('/', bills.get);
apiRouter.use('/bills', billsRouter);


rootRouter.use('/api', apiRouter);

export default rootRouter;
