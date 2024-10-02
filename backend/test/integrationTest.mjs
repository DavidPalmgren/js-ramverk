
import { use, expect } from "chai";
import 'dotenv/config';
import chaiHttp from "chai-http";
import docModule from "../Infrastructure/docModule.mjs";
import { startServer, closeServer } from "../app.mjs";
import app from '../app.mjs';
import DocModule from "../Infrastructure/docModule.mjs";
const chai = use(chaiHttp);

describe('intergration test', () => {

    before(async () => {
        await startServer();
    });


    after(async () => {
        await closeServer();
    })

    describe('Adding document', () => {
        let id;
        afterEach(async () => {
            if(id) {
                await docModule.findByIdAndDelete(id);
                id = undefined;
            }
        });
        it('should create a new document on POST /document', (done) => {
            const title = "hej";
            const content = "inget";
            chai.request.execute(app)
                .post('/')
                .send({ title: title, content: content })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.data.title).to.equal(title);
                    expect(res.body.data.content).to.equal(content);
                    expect(res.body.data).to.have.property('_id');
                    id = res.body.data._id;
                    done();
                });
        });

        it('should not create a new document', (done) => {
            const title = "hej";
            const content = "inget";
            chai.request.execute(app)
                .post('/')
                .send({ missing: title, content: content })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    if(res.body.data) {
                        id = res.body.data._id;
                    }
                    done();
                });
        });
    });

    describe("updating existing document", () => {
        let id;
        const title = "Title1";
        const content = "Content1";
        beforeEach(async () => {
            const document = new DocModule({ title, content });
            await document.save();
            id = document.id;
        });

        afterEach(async () => {
            if(id) {
                await docModule.findByIdAndDelete(id);
                id = undefined;
            }
        })

        it("Should update document all fields", (done) => {
            const title2 = "Title2";
            const content2 = "Content2";
            chai.request.execute(app)
                .put(`/${id}`)
                .send({title: title2, content: content2})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data.title).to.equal(title2);
                    expect(res.body.data.content).to.equal(content2);
                    (async () => {
                        const document = await DocModule.findById(id);
                        expect(document.title).to.equal(title2);
                        expect(document.content).to.equal(content2);
                        done();
                    })();
                })
        })

        it("Should update document title", (done) => {
            const title2 = "Title2";
            chai.request.execute(app)
                .put(`/${id}`)
                .send({title: title2})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data.title).to.equal(title2);
                    (async () => {
                        const document = await DocModule.findById(id);
                        expect(document.title).to.equal(title2);
                        expect(document.content).to.equal(content);
                        done();
                    })();

                })

        })

        it("Should update document content", (done) => {
            const content2 = "Content2";
            chai.request.execute(app)
                .put(`/${id}`)
                .send({content: content2})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data.content).to.equal(content2);
                    (async () => {
                        const document = await DocModule.findById(id);
                        expect(document.content).to.equal(content2);
                        expect(document.title).to.equal(title);
                        done();
                    })();

                })

        })
    })

    it("Should get all documents", (done) => {
        chai.request.execute(app)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.data).to.be.an('array');
                done();
            })

    })

    describe("Get document", () => {
        let id;
        const title = "title";
        const content = "content";
        before(async () => {

            const document = new DocModule({ title, content });
            await document.save();
            id = document.id;
        });

        after(async () => {
            if(id) {
                await docModule.findByIdAndDelete(id);
            }
        })

        it("Get document that is created", (done) => {
            chai.request.execute(app)
                .get(`/${id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.data.content).to.equal(content);
                    expect(res.body.data.title).to.equal(title);
                    expect(res.body.data._id).to.equal(id);
                    done();
                })
        });
    });


})

