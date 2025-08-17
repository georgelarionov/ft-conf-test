import React, { useEffect, useState } from 'react';
import { ModelView } from 'components/ModelView/ModelView';
import { Color, Vector2 } from 'three';
import { DefaultMaterialProps, TextureItem } from 'type';
import { inputOnChange } from 'utils/handlers';
import { TextureInputs } from './TextureInputs/TextureInputs';
import { texturesSamples } from './texturesSamples';

import s from './styles.module.css';
import { EditMode } from '../ModelView/View/ModelView.types';
import { UISimpleCard } from '../UI/UISimpleCard/UISimpleCard';

export const TextureSettings = () => {
  
  const [title, setTitle] = useState("")
  const [state, setState] = useState({
    ...DefaultMaterialProps
  });

  const updateModelView = (item: TextureItem) => {
    ModelView.Instance.setEditMode(EditMode.Texture);
    ModelView.Instance.setColor(new Color("#ff0"));

    ModelView.Instance.setMaterialTextures(item.slug, 
        new Vector2(item.repeat.x, item.repeat.y), item.materialUse);

    // set default
    setState({ ...item.materialDefaults })
    setTitle(item.title)
  };

  useEffect(() => {
    ModelView.Instance.setMaterialProps({ 
          metalness: state.metalness / 100, 
          roughness: state.roughness / 100, 
          normal: state.normal });

    setTitle("Default");
    
  }, [state.metalness, state.normal, state.roughness]);
  
  useEffect(() => {
    return () => {
      ModelView.Instance.setEditMode(EditMode.None);
      ModelView.Instance.setColor(null);
      ModelView.Instance.setMaterialTextures(null, new Vector2(0, 0), 
          { normal: false, rough: false });
    };
  }, []);


  return (
    <div className={`${s.textureSettings}`}>
      {(
        <>
          <TextureInputs values={state} onChange={inputOnChange(setState)} />
          {Object.keys(texturesSamples).flatMap(key => texturesSamples[key].items.map(
            (item) => (
              <UISimpleCard
                key={item.slug}
                title={item.title}
                selected={item.title === title}
                onClick={() => updateModelView(item)}
                image={item.image}
              />
            )
          ))}
        </>
      )}
    </div>
  );
};
