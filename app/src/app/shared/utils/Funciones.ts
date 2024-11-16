import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Deferred } from "ts-deferred";

export class Funciones {

  constructor(   
  ) {
  }

  static esUndefinedNullOrEmpty(valor: any): boolean {
    if (valor === undefined || valor === null || valor === "") {
      return true;
    }
    return false;
  }

  static esComboVacio(valor: any): boolean {
    if (valor === undefined || valor === null || valor.Id.toString() === "" || valor.Id.toString() === "00000000-0000-0000-0000-000000000000") {
      return true;
    }
    return false;
  }

  static getDateFechaActual() {
    var d = new Date();
    var dia = (d.getDate() > 9 ? d.getDate() : '0' + d.getDate());
    var mes = (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1));
    var dformat = [dia, mes, d.getFullYear()].join('/');
    return dformat;
  }

  static ConvertirDateToString(fecha: Date): string {
    if (!fecha) {
      return '';
    }
    let result = "";
    const dia = fecha.getDate() > 9 ? fecha.getDate() : "0" + fecha.getDate();
    const mes =
      fecha.getMonth() + 1 > 9
        ? fecha.getMonth() + 1
        : "0" + (fecha.getMonth() + 1);

    result = [dia, mes, fecha.getFullYear()].join("/");
    return result;
  }

  static ConvertirDateFechaHoraToString(fecha: Date): string {
    if (!fecha) {
      return '';
    }
    let result = "";
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const hora = fecha.getHours().toString().padStart(2, "0");
    const minuto = fecha.getMinutes().toString().padStart(2, "0");

    result = [dia, mes, fecha.getFullYear()].join("/") + " " + [hora, minuto].join(":");

    return result;
  }

  static convertirArrayByte = (arrayBuffer: any) => {
    const d: Deferred<any> = new Deferred<any>();
    const reader = new FileReader();

    reader.onloadend = function (e) {
      const arrayBuffer = e.target!.result;
      const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
      const bytesArchivo = [].slice.call(uint8Array);
      d.resolve(bytesArchivo);
    };

    reader.readAsArrayBuffer(arrayBuffer);

    return d.promise;
  };

  static esArchivoExtensionValida = (nombreArchivo: string, textoExtensionesValidas: string): boolean => {
    const archivoSplit = nombreArchivo.split('.');
    const extensionArchivo = archivoSplit[archivoSplit.length - 1];

    const esExtensionNoPermitida = (textoExtensionesValidas.split(',').filter((extension: string) => {
      return extension.trim().toUpperCase() === extensionArchivo.toUpperCase();
    }));

    return esExtensionNoPermitida.length > 0;
  }

  static getExtensionArchivo = (nombreArchivo: string): string => {
    const archivoSplit = nombreArchivo.split('.');
    const extensionArchivo = archivoSplit[archivoSplit.length - 1];

    return extensionArchivo;
  }

  static reemplazarNombreArchivo(nombreArchivo: string): string {
    let fileName = nombreArchivo.slice(0, nombreArchivo.lastIndexOf('.'));
    fileName = this.replaceUnsupportedCharacters(fileName);
    const extension = nombreArchivo.substr(nombreArchivo.lastIndexOf('.') + 1, nombreArchivo.length);
    return fileName + '.' + extension;
  }
  
  public static replaceUnsupportedCharacters(fileName: string): string {
    fileName = fileName.replace("#", "");
    fileName = fileName.replace("%", "");
    fileName = fileName.replace("&", "");
    fileName = fileName.replace("*", "");
    fileName = fileName.replace(":", "");
    fileName = fileName.replace("<", "");
    fileName = fileName.replace(">", "");
    fileName = fileName.replace("?", "");
    fileName = fileName.replace("/", "");
    fileName = fileName.replace("{", "");
    fileName = fileName.replace("|", "");
    fileName = fileName.replace("}", "");
    fileName = fileName.replace("~", "");
    fileName = fileName.replace("\\", "");
    fileName = fileName.replace('"', "");
    fileName = fileName.replace("'", "");
    fileName = fileName.replace("á", "a");
    fileName = fileName.replace("é", "e");
    fileName = fileName.replace("í", "i");
    fileName = fileName.replace("ó", "o");
    fileName = fileName.replace("ú", "u");
    fileName = fileName.replace("Á", "A");
    fileName = fileName.replace("É", "E");
    fileName = fileName.replace("Í", "I");
    fileName = fileName.replace("Ó", "O");
    fileName = fileName.replace("Ú", "U");
    return fileName;
  }
}
