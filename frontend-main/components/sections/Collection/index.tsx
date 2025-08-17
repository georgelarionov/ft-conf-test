import Button from '../../UI/Button'
import css from './collection.module.scss'

const COLLECTION = new Array(20).fill('')

const Collection = () => {
  return (
    <div className={css.collection}>
      <div className={css.header}>
        Collection (Coming soon)
        {/*<div className={css.buttons}>*/}
        {/*  <Button className={css.button}>Items</Button>*/}
        {/*  <Button className={css.button}>Designers</Button>*/}
        {/*</div>*/}
      </div>
      <div className={css.list}>
        <div className={css.inner}>
          {/*{COLLECTION.map((item, index) => {*/}
          {/*  return (*/}
          {/*    <div key={`collection-id-${index}`} className={css.item}>*/}
          {/*      <img src="/my-collection-test-item@2x.png" alt="" />*/}
          {/*    </div>*/}
          {/*  )*/}
          {/*})}*/}
        </div>
      </div>
    </div>
  )
}

export default Collection
