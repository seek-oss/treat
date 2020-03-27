import React from 'react';
import {mesage, emoji} from './SecretMessage.treat'

const Emoji = ({glyph, label}) => <span role="img" aria-label={label} className={emoji}>{glyph}</span>

export const SecretMessage =  ({...otherProps}) => (
    <div {...otherProps}>
        <p className={mesage}>Enjoy a treat!</p>
        <Emoji glyph="🍬" label="hard boiled sweet"/>
        <Emoji glyph="🍭" label="lollipop"/>
        <Emoji glyph="🍰" label="cake"/>
        <Emoji glyph="🧁" label="cupcake"/>
        <Emoji glyph="🍫" label="chocolate"/>
        <Emoji glyph="🍪" label="cookie"/>
        <Emoji glyph="🍩" label="donut"/>
    </div>
);