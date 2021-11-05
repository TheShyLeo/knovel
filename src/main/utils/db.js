'use strict';
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

export default {
    data() {
        return {
            db_util: null,
            file_json: ""
        };
    },
    init() {
        if (!this.db_util) {
            let APP = process.type === 'renderer' ? remote.app : app
            let STORE_PATH = APP.getPath('userData')

            if (process.type !== 'renderer') {
                if (!fs.pathExistsSync(STORE_PATH)) {
                    fs.mkdirpSync(STORE_PATH)
                }
            }

            this.file_json = new FileSync(path.join(STORE_PATH, '/knovel_data1.json'));

            this.db_util = low(this.file_json)
        }
        if (!this.db_util.has('current_directory').value()) {
            this.initConfig();
        }
        return this.db_util;
    },
    initConfig() {
        this.db_util.set('current_directory', "").write()

        if (!this.db_util.has('books').value()) {
            this.db_util.set('books', []).write()
        }

        if (!this.db_util.has('book_id').value()) {
            this.db_util.set('book_id', "").write()
        }

        if (!this.db_util.has('auto_page').value()) {
            this.db_util.set('auto_page', "0").write()
        }

        if (!this.db_util.has('key_next').value()) {
            this.db_util.set('key_next', "Alt+C").write()
        }

        if (!this.db_util.has('key_previous').value()) {
            this.db_util.set('key_previous', "Alt+Z").write()
        }

        if (!this.db_util.has('key_boss').value()) {
            this.db_util.set('key_boss', "Alt+X").write()
        }

        if (!this.db_util.has('key_auto').value()) {
            this.db_util.set('key_auto', "CmdOrCtrl+Alt+P").write()
        }

        if (!this.db_util.has('desktop_wh').value()) {
            this.db_util.set('desktop_wh', "").write()
        }

        if (!this.db_util.has('desktop_wz').value()) {
            this.db_util.set('desktop_wz', "").write()
        }

        if (!this.db_util.has('is_display_page').value()) {
            this.db_util.set('is_display_page', false).write()
        }
    },
    updateBookById(book) {
        //if (!this.db_util) { this.init(); }
        return this.db_util.get('books').find({ id: book.id }).assign(book).write();
    },
    getBookById(id) {
        //if (!this.db_util) { this.init(); }
        return this.db_util.read().get('books').find({ id: id }).cloneDeep().value();
    },
    get(key) {
        if (!this.db_util) { this.init(); }
        return this.db_util.read().get(key).value();
/*      坑： main进程和renderer进程拿到的db都是应用打开时所读取的。
        在没有额外处理的情况下，在main进程拿到的内存里的db，
        和renderer拿到的内存里的db不是同一个db，也就是所谓的不是一个db的两份引用，
        而是一个db的两份拷贝。main进程对其进行的操作，renderer进程是不知道的。
        换句话说，main进程对db进行了任何读写操作，renderer拿到的db依然是当初应用打开时所读取的db。
        所以就会遇到main进程更新了数据，而renderer进程依然无法拿到新的数据。
        解决方法：在所有的db操作的最开始，都重新读取一遍db的最新状态 */
    },
    set(key, value) {
        //if (!this.db_util) { this.init(); }
        this.db_util.set(key, value).write();
    }
};