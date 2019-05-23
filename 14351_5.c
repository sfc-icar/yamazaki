/* shisoku.c 71649019 山田 航大郎 */
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <math.h>
#define MAXLINE 256

struct frac{
    int shi;
    int bo;
};
int yakubun(struct frac *h);

void tasu(struct frac *f, struct frac *g, struct frac *h){
    h->shi = f->shi * g->bo + g->shi * f->bo;
    h->bo = f->bo * g->bo;
    yakubun(h);
}
void hiku(struct frac *f, struct frac *g, struct frac *h){
    h->shi = f->shi * g->bo - g->shi * f->bo;
    h->bo = f->bo * g->bo;
    yakubun(h);
}
void kakeru(struct frac *f, struct frac *g, struct frac *h){
    h->shi = f->shi * g->shi;
    h->bo = f->bo * g->bo;
    yakubun(h);
}
void waru(struct frac *f, struct frac *g, struct frac *h){
    h->shi = f->shi * g->bo;
    h->bo = f->bo * g->shi;
    yakubun(h);
}
int yakubun(struct frac *h){
    while(1){
        int i = 2;
        while(1){
            if (i > h->bo){
                return 0;
            }
            if (h->shi % i == 0 && h->bo % i == 0){
                h->shi = h->shi / i;
                h->bo = h->bo / i ;
                break;
            }
            i = i + 1;
        }
    }
}
int main(){
    int ret;
    char input[MAXLINE];
    struct frac f,g,h;
    fgets(input,MAXLINE,stdin);
    ret = sscanf(input,"%d/%d",&f.shi, &f.bo);
    if(ret != 2) {
        exit(1);
    }
    fgets(input,MAXLINE,stdin);
    ret = sscanf(input,"%d/%d",&g.shi, &g.bo);
    if(ret != 2) {
        exit(1);
    }
    tasu(&f,&g,&h);
    if(h.bo == 1){
        printf("%d/%d + %d/%d = %d\n",f.shi, f.bo,g.shi, g.bo,h.shi);
    }else{
        printf("%d/%d + %d/%d = %d/%d\n",f.shi, f.bo,g.shi, g.bo,h.shi, h.bo);
    }
    hiku(&f,&g,&h);
    if(h.bo == 1){
        printf("%d/%d - %d/%d = %d\n",f.shi, f.bo,g.shi, g.bo,h.shi);
    }else{
        printf("%d/%d - %d/%d = %d/%d\n",f.shi, f.bo,g.shi, g.bo,h.shi, h.bo);
    }
    kakeru(&f,&g,&h);
    if(h.bo == 1){
        printf("%d/%d * %d/%d = %d\n",f.shi, f.bo,g.shi, g.bo,h.shi);
    }else{
        printf("%d/%d * %d/%d = %d/%d\n",f.shi, f.bo,g.shi, g.bo,h.shi, h.bo);
    }
    waru(&f,&g,&h);
    if(h.bo == 1){
        printf("%d/%d / %d/%d = %d\n",f.shi, f.bo,g.shi, g.bo,h.shi);
    }else{
        printf("%d/%d / %d/%d = %d/%d\n",f.shi, f.bo,g.shi, g.bo,h.shi, h.bo);
    }
    exit(0);
}
