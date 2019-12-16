import React from 'react';
import {button} from './Button.treat'

export const Button = ({...otherProps}) => <button {...otherProps} className={button}/>;