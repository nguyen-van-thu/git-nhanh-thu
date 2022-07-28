const qs = require('qs');
const fs = require('fs');
const {raw} = require("mysql");
const Tag = require("../model/tag");

class TagsController {
    constructor() {
        this.tag = new Tag();
    }

    showTangs(req, res) {
        fs.readFile('template/Tags.html', 'utf-8', async (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let tags = await this.tag.getAllTag();
                let thead = '';
                for (let index = 0; index < tags.length; index++) {
                    thead +=
                        `<tr>
                                            <th style="width: 20px;">
                                                <div class="custom-control custom-checkbox">
                                                    <input type="checkbox" class="custom-control-input" id="customCheck0">
                                                    <label class="custom-control-label" for="customCheck0">&nbsp;</label>
                                                </div>
                                            </th>
                                            <th>${tags[index].id}</th>
                                            <th>${tags[index].name}</th>
                                            <th>${tags[index].slug}</th>
                                            <th>${tags[index].innings}</th>
                                            <th>${tags[index].view}</th>
                                            <td>
                                            <a  href="/delete?id=${tags[index].id}" class="btn btn-danger" onclick="return confirm('Bạn có muốn xóa!')">Xóa</a>
                                            <a href="/update?id=${tags[index].id}" class="btn btn-success">Sửa</a>
                                            </td>
                                            
                                        </tr>`

                }
                data = data.replace('{Tags}', thead);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }

    createTags(req, res) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
        });
        req.on('end', () => {
            let tags = qs.parse(data);
            this.tag.createTag(tags);
                res.writeHead(301, {
                    location : '/ ',
                });

            return res.end();
        })
    }
    showaddTags(req,res){
        fs.readFile('template/Add-tags.html','utf-8',(err,data)=>{
            if (err){
                console.log(err);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }
    deleteTags(req,res,idDelete) {
        this.tag.deletetag(idDelete);
        res.writeHead(301, {
            location : '/ ',
        });
        return res.end();
    }

}
module.exports = TagsController;