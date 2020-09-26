import * as core from "express-serve-static-core";
import indexRouter from './routes/index';

export function routesSetup(app: core.Express) {
    
    app.use('/', indexRouter);

    //404 - Not found at the end of the routes definitions
    app.use((req, res) => {
        res.status(404).render('404');
    });
}