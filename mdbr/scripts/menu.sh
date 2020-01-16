#!/bin/bash
VERT="\\033[1;32m"
NORMAL="\\033[0;39m"
ROUGE="\\033[1;31m"
BLEU="\\033[1;34m"
JAUNE="\\033[1;33m"

if [ ! -d ${data} ];then
        data=./data
else
        data=/data/db
fi

AppelSaisie() {
        # On verifie s'il s'agit d'une commande ou d'un menu
        SAISIE=$1
        if [ -z ${SAISIE} ];then
                echo -e ""$JAUNE" Saisie vide!!!"
        else
                case ${SAISIE} in
                        1) backup;;
                        2) restore;;
                        3) manage;;
                        *) echo -e ""$JAUNE" Saisie invalide!!!";;
                esac
        fi
}

backup() {
        cat ${data}/.conf
        echo
        echo -en """$JAUNE""--> copier/coller la connexion (q pour quitter) ? ""$NORMAL"""
        read uri

        if [[ -z ${uri} || ${uri} == "q" ]];
        then
                menu
        fi

        echo -en """$JAUNE""--> saisir le tag de cette sauvegarde (q pour quitter, $(echo ${uri}| cut -d'/' -f4)_$(date +%Y%m%d)) ? ""$NORMAL"""
        read tag
        if [[ -z ${tag} || ${tag} == "q" ]];
        then
                menu
        fi
        ${mongo}dump --uri=\"${uri}\" --archive="${data}/${tag}.dump"
        if [ ${?} != 0 ];
        then
                echo -e ""$ROUGE"erreur lors de la sauvegarde""$NORMAL"""
        else
                echo -e ""$VERT"sauvegarde OK""$NORMAL"""
        fi
        echo -e """$NORMAL""Entrée pour continuer""$NORMAL"""
        read pause
        menu
}

restore() {
        ls -ltr ${data}/*.dump
        echo -en """$JAUNE""--> copier/coller le nom du fichier (q pour quitter) ? ""$NORMAL"""
        read archive

        if [[ -z ${archive} || ${archive} == "q" ]];
        then
                menu
        fi
        cat ${data}/.conf
        echo
        echo -en """$JAUNE""--> copier/coller la connexion cible (q pour quitter) ? ""$NORMAL"""
        read uri

        if [[ -z ${uri} || ${uri} == "q" ]];
        then
                menu
        fi

        ${mongo}restore --uri=\"${uri}\" --archive="${archive}" --drop #--nsFrom="source.*" --nsTo="destination.*"
        if [ ${?} != 0 ];
        then
                echo -e ""$ROUGE"erreur lors de la restauration"
        else
                echo -e ""$VERT"restauration OK""$NORMAL"""
        fi
        echo -e """$NORMAL""Entrée pour continuer""$NORMAL"""
        read pause
        menu
}

manage() {
        ls -ltr ${data}/*.dump
        echo -en """$JAUNE""--> copier/coller le nom du fichier à supprimer (q pour quitter) ? ""$NORMAL"""
        read archive

        if [[ -z ${archive} || ${archive} == "q" ]];
        then
                menu
        fi
        rm "${archive}"
        manage
}

menu() {
        # Affichage de l'entete du menu
        clear
        echo -e """$JAUNE""**************************""$NORMAL"""
        echo -e """$JAUNE""     MENU ${MENU_NAME}    ""$NORMAL"""
        echo -e """$JAUNE""**************************""$NORMAL"""
        echo
        echo -e """$NORMAL""1: sauvegarde d'une base""$NORMAL"""
        echo -e """$NORMAL""2: restauration d'une base""$NORMAL"""
        echo -e """$NORMAL""3: Gestion des sauvegardes""$NORMAL"""
        echo -en """$JAUNE""--> Que voulez-vous faire (q pour quitter) ? ""$NORMAL"""
        read CHOICE

        case ${CHOICE} in
                q) exit;;
                *) AppelSaisie ${CHOICE}
                ;;
        esac
}

# Verification de la presence des outils MongoDB
mongo="/usr/bin/mongo"
if [[ ! -f ${mongo} || ! -f "${mongo}dump" || ! -f "${mongo}restore" ]];
then
	echo -e """$ROUGE""outils dump + restore MongoDB introuvables""$NORMAL"""
	#exit 1
fi

menu

