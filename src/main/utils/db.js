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

            this.file_json = new FileSync(path.join(STORE_PATH, '/thief_data.json'));

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
        return this.db_util.get('books').find({ id: id }).cloneDeep().value();
    },
    get(key) {
        if (!this.db_util) { this.init(); }
        return this.db_util.get(key).value();
    },
    set(key, value) {
        //if (!this.db_util) { this.init(); }
        this.db_util.set(key, value).write();
    }
};