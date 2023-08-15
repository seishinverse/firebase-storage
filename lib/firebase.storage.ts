import { Bucket } from '@google-cloud/storage';
import { credential, storage as firebaseStorage } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

import { SETTER_BUCKET_WRONG_VALUE } from './firebase.constants';
import { IFile, IFirebaseStorageOptions } from './firebase.types';


export class FirebaseStorage {
  private storage: Bucket

  constructor(options: IFirebaseStorageOptions) {
    const { clientEmail, privateKey, projectId, ...firebaseOptions } = options
    initializeApp({ credential: credential.cert({ clientEmail, privateKey, projectId }) })
    this.$firebaseOptions = firebaseOptions
    this.$bucket = ''
  }

  async delete(key: string) {
    if (!this.storage) this.storage = firebaseStorage().bucket(this.bucket)

    await this.storage?.file(key).delete()

    return {
      success: true
    }
  }

  async upload(file: IFile) {
    if (!this.storage) this.storage = firebaseStorage().bucket(this.bucket)
    await this.storage.file(file.originalname).save(file.buffer, { gzip: this.$firebaseOptions.gzip || true, contentType: file.mimetype })

    return {
      key: file.originalname,
      success: true
    }
  }

  async getUrl(key: string) {
    if (!this.storage) this.storage = firebaseStorage().bucket(this.bucket)
    const url = await this.storage.file(key).getSignedUrl({
      expires: this.$firebaseOptions.expiration || '03-09-2491',
      action: this.$firebaseOptions.action || 'read'
    })

    return url[0]
  }

  async download(key: string) {
    if (!this.storage) this.storage = firebaseStorage().bucket(this.bucket)
    const buffer = (await this.storage.file(key).download())[0]
    const file = (await this.storage.file(key).getMetadata())[0]

    return {
      buffer,
      size: file.size,
      mimetype: file.contentType,
      originalname: file.name
    }
  }

  set bucket(value: string) {
    if (typeof value === 'string' && value.trim().length) {
      this.$bucket = value
      return
    }
    throw new Error(SETTER_BUCKET_WRONG_VALUE)
  }

  get bucket() {
    return this.$bucket
  }

  private $firebaseOptions: Omit<IFirebaseStorageOptions, 'clientEmail' | 'privateKey' | 'projectId'>
  private $bucket: string
}