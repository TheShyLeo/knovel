'use strict';

import fs from "fs"
import db from "./db"
import { md5 } from "./crypto"
import iconv from "iconv-lite"
import { defaults } from "lodash"

let data, chapter;
let book_info = {
    curr_page: 1,       //当前页码
    page_size: 15,       //页面大小
    second: 5,          //自动翻页
    font_size: 20,      //字体
    line_break: " ",    //分隔符
    bg_color: "rgba(0, 0, 0, 0.15)",       //背景色
    txt_color: "rgba(255, 255, 255, 0.76)",      //字体色
    errCodeChecked: false,      //编码
}

export default {
    data() {
        return {
            curr_page_number: 1,
            page_size: 50,
            page: 0,
            start: 0,
            end: this.page_size,
            directoryPath: "",
            bookPath: "",
            book_id: "",
            line_break: " ",
            errCode: false
        };
    },
    getSize(text) {
        let size = text.length;
        if (!this.page) {
            this.page = Math.ceil(size / this.page_size);
        }
    },
    getNovels(dirPath) {
        const files = fs.readdirSync(dirPath);
        let res = [];
        for (const v of files) {
            if (v.includes('.txt')) {
                let obj = {};
                obj.name = v.slice(0, v.lastIndexOf('.'));
                obj.path = dirPath + "\\" + v;
                obj.id = md5(obj.path);
                defaults(obj, book_info);
                res.push(obj);
            }
        }
        return res;
    },
    getPage(type) {
        let curr_page = db.getBookById(this.book_id).curr_page;
        var page = 0;

        if (type === "previous") {
            if (curr_page <= 1) {
                page = 1;
            } else {
                page = curr_page - 1;
            }
        } else if (type === "next") {
            if (curr_page >= this.page) {
                page = this.page;
            } else {
                page = curr_page + 1;
            }
        } else if (type === "curr") {
            page = curr_page;
        }

        this.curr_page_number = page;
    },
    updatePage() {
        let update = {};
        update.id = this.book_id;
        update.curr_page = this.curr_page_number;
        db.updateBookById(update);
    },
    getStartEnd() {
        this.start = this.curr_page_number * this.page_size;
        this.end = this.curr_page_number * this.page_size - this.page_size;
    },
    readFile(refresh) {
        if (!refresh && data) return data;
        if (this.bookPath === "" || typeof (this.bookPath) === "undefined") {
            return "请选择TXT小说路径"
        }

        try {
            data = fs.readFileSync(this.bookPath);

            if (this.errCode) {
                data = iconv.decode(data, 'gb2312');
            } else {
                data = iconv.decode(data, 'utf-8');
            }
        } catch (error) {
            return "TXT小说路径不存在或路径不正确"
        }

        var line_break = this.line_break;

        data = data.toString().replace(/\n/g, "").replace(/\r/g, "").replace(/\s+/g, " ");
        return data;
    },
    initBooks() {
        let dbUtil = db.init();
        this.directoryPath = db.get("current_directory");
        if (this.directoryPath === "" || typeof (this.directoryPath) === "undefined") {
            return { code: 1, msg: "请选择TXT目录" }
        }
        let books = this.getNovels(this.directoryPath);
        for (const v of books) {
            if (!db.getBookById(v.id)) {
                dbUtil.get('books').push(v).write();
            }
        }
        let res = this.init();
        return res;
    },
    init() {
        if (this.bookPath && this.bookPath !== "" && this.page_size) return { code: 0, msg: "success!" };
        this.book_id = db.get('book_id');
        if (this.book_id === "" || typeof this.book_id === "undefined") {
            return { code: 1, msg: "请选择TXT" }
        }
        let book = db.getBookById(this.book_id);
        this.bookPath = book.path;
        this.errCode = book.errCodeChecked;
        this.page_size = book.page_size;
        this.line_break = book.line_break;
        let text = this.readFile();
        chapter = this.novel_slice(text);
        return { code: 0, msg: "success!", data:chapter };
    },
    refresh(book_id) {
        this.book_id = book_id;
        let book = db.getBookById(book_id);
        this.bookPath = book.path
        this.errCode = book.errCodeChecked;
        this.page_size = book.page_size;
        this.line_break = book.line_break;
        let text = this.readFile(true);
        chapter = this.novel_slice(text);
        return { code: 0, msg: "success!", data:chapter };
    },
    makePage(text) {
        this.getStartEnd();
        this.updatePage();
        // if (db.get("is_display_page")) {
        //     var page_info = this.curr_page_number.toString() + "/" + this.page.toString();
        //     return text.substring(this.start, this.end) + "    " + page_info;
        // } else {
        //     return text.substring(this.start, this.end)
        // }
        return text.substring(this.start, this.end)
    },
    getPreviousPage() {
        this.init();
        let text = this.readFile();
        this.getSize(text);
        this.getPage("previous");
        return this.makePage(text);
    },
    getNextPage() {
        this.init();
        console.log(this.book_id)
        let text = this.readFile();
        this.getSize(text);
        this.getPage("next");
        return this.makePage(text);
    },
    getJumpingPage() {
        this.init();
        let text = this.readFile();
        this.getSize(text);
        this.getPage("curr");
        return this.makePage(text);
    },
    soText(so) {
        this.init();
        // 小说搜索
        let text = this.readFile();
        this.getSize(text);

        // 存储搜索结果
        var soResult = [];

        // 正则
        var re = new RegExp(so, "g");
        var result = "";

        do {
            try {
                result = re.exec(text);

                // 分页位置
                var page = Math.ceil(result.index / this.page_size);

                // 附近内容
                var textx = text.substring(result.index - 30, result.index + 31)

                // 加入结果 数组
                soResult.push({
                    index: result.index,
                    page: page,
                    text: textx
                })
            } catch (error) { }
        }
        while (result != null)

        return soResult;
    },
    // 提取小说名
    get_novelName(bookPath) {
        var index = bookPath.lastIndexOf("\\"); // 获取路径最后一个单元的序号
        var name = bookPath.slice(index + 1); // 切割获得最后一个单元
        index = name.lastIndexOf("."); // 找准.号切割
        name = name.slice(0, index);  // 切割出文件名
        return name; // 返回文件名
    },
    // 小说文件解码操作
    fileType(buffer) {
        if (buffer[0] == 0xff && buffer[1] == 0xfe) {
            return 'utf16'
        } else if (buffer[0] == 0xfe && buffer[1] == 0xff) {
            return 'utf16'
        } else if (buffer[0] == 0xef && buffer[1] == 0xbb) {
            return 'utf8'
        } else {
            return 'GBK'
        }
    },

    // 判断是不是数字
    isNumber(char) {
        if (char == '1' || char == '一') return true;
        else if (char == '2' || char == '二') return true;
        else if (char == '3' || char == '三') return true;
        else if (char == '4' || char == '四') return true;
        else if (char == '5' || char == '五') return true;
        else if (char == '6' || char == '六') return true;
        else if (char == '7' || char == '七') return true;
        else if (char == '8' || char == '八') return true;
        else if (char == '9' || char == '九') return true;
        else if (char == '0' || char == '零') return true;
        else if (char == '十') return true;
        else if (char == '百') return true;
        else if (char == '千') return true;
        else if (char == '万') return true;
        else return false;
    },

    // 小说章节切割函数
    novel_slice(text) {
        var result = new Array();
        var i = 0;
        while (i < text.length) {
            // 提取标题
            if (text[i] == "第") {
                var caption = "第";
                var j = i + 1; // 切换到数字
                if (j >= text.length) break; // 容错处理
                while (this.isNumber(text[j])) {
                    caption += text[j];
                    j++; if (j >= text.length) break; // 容错处理
                }
                if ((j >= text.length) && (j + 1 >= text.length)) break; // 容错处理
                if ((text[j] == "章" || text[j] == "节" || text[j] == "回") && (text[j + 1] == " ")) { // 说明的确是标题了，如果不是的话，算入正文
                    caption += text[j];
                    i = j + 1; // 接下来进行章节名的获取，从这里开始，到找到一个有回车或者空格的段落结束
                    if (i >= text.length) break; // 容错处理
                    while (text[i] == " ") { // 因为可能是个空格，应该直到没有空格结束
                        caption += text[i];
                        i += 1;
                        if (i >= text.length) break; // 容错处理
                    }
                    while ((text[i] != " ") && (text[i] != "\n")) { // 现在不是空格了，这时候要判断是空格的时候结束
                        caption += text[i];
                        i += 1;
                        if (i >= text.length) break; // 容错处理
                    }
                    var position = i;
                    // var content = ""; // 下面就是内容获取
                    // while (i < text.length) {
                    //     if (i + 1 >= text.length) break; // 容错处理
                    //     if (text[i + 1] == "第") { // 用于判断是不是标题，+1的目的是为了下面的i+=1设定的
                    //         if (i + 2 >= text.length) break; // 容错处理
                    //         var j = i + 2; while (isNumber(text[j])) {
                    //             j += 1;
                    //             if (j >= text.length) break; // 容错处理
                    //             if (j + 1 >= text.length) break; // 容错处理
                    //         } // 搜集里面的数字
                    //         if ((text[j] == "章" || text[j] == "节" || text[j] == "回") && (text[j + 1] == " ")) { break; }
                    //     } // 表明的确是标题，break掉
                    //     content += text[i];
                    //     i += 1;
                    // }
                    var chapter = { caption: caption, position: position };
                    result[result.length] = chapter;
                }
                else { }// 如果不是'章'的话，说明那就不是标题，而是一段文本，在这种情况下，这种文本不能算入章节中的，应该舍弃不要
            }
            i += 1; // 用于找标题的一直递增
        }
        return result;
    }
};