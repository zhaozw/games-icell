yc.outer.BossCompass = cc.Sprite.extend({
	
	arrBosses: []
	
	, nearestDis: 0
	, bossPoint: null
	, bossAngle: 0
	
    , _visit: cc.Sprite.prototype.visit
    , visit: function(ctx){
    	
    	// 计算最近的 boss
    	var boss = this.nearestBoss() ;
    	this.bossPoint = boss? this.pointOnCameraBorder(boss): null ;
    	
    	this._visit(ctx) ;
    }
    
    , draw: function(ctx){
    	
    	if(this.bossPoint)
    	{
    		ctx.translate(this.bossPoint[0],-this.bossPoint[1]) ;
    	}
    	
		ctx.rotate(Math.PI+this.bossAngle);
    	
    	yc.util.drawPolygon( [ [20,40], [-20,40], [0,0] ], ctx, null, 'red' ) ;
    	
    	ctx.fillStyle = 'white' ;
        ctx.fillText('ˋ﹏ˊ',-12,35) ;
    	ctx.fillStyle = 'yellow' ;
        ctx.fillText(Math.round(this.nearestDis)+' km',-20,55) ;
    }
    
    , nearestBoss: function(){
    	
    	var cell = yc.outer.Cell.ins() ;
    	this.nearestDis = 0 ;
    	var nearestBoss = null ;
    	
    	for(var i=0;i<this.arrBosses.length;i++)
    	{
    		var boss = this.arrBosses[i] ;
    		var dis = yc.util.pointsDis(cell.x,cell.y,boss.x,boss.y) ;
    		
    		if( dis<this.nearestDis || this.nearestDis<=0 )
    		{
    			this.nearestDis = dis ;
    			nearestBoss = boss ;
    		}
    	}
    	
    	return nearestBoss ;
    }
    
    , pointOnCameraBorder: function(boss){
    	
		var cell = yc.outer.Cell.ins() ;
		this.bossAngle = yc.util.radianBetweenPoints(boss.x,boss.y,cell.x,cell.y) ;
		
		// 指向 boss 方向的一根射线
		var w = $(window).width() ;
		var h = $(window).height() ;
		var l = Math.max(w,h) * 2 ;
		var bossPoint = [ l*Math.sin(this.bossAngle), l*Math.cos(this.bossAngle) ] ;
		
		// 检查射线在摄像机边界上的交点
		var borders = [
			[[-w/2,h/2],[w/2,h/2]] 		// 上
			, [[-w/2,-h/2],[w/2,-h/2]] 	// 下
			, [[-w/2,h/2],[-w/2,-h/2]] 	// 左
			, [[w/2,h/2],[w/2,-h/2]] 	// 右
		] ;
		for(var i=0;i<borders.length;i++)
		{
			var point = yc.util.lineOnLine([[0,0],bossPoint],borders[i]) ;
			if(point.length==2)
			{
				return point ;
			}
		}
		
		return null ;
    }
	
}) ;